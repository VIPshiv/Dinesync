import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // {type:'ok'|'err', msg}
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  // Only clear status when navigating if not already subscribed
  useEffect(()=>{ if(!subscribed) setStatus(null); }, [location.pathname, subscribed]);

  // Initial subscription status load (persist only for logged-in users)
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      const saved = localStorage.getItem('subscribedEmail');
      if(saved){
        setSubscribed(true);
        setCurrentEmail(saved);
        setStatus({ type:'ok', msg: `Already subscribed to ${saved}` });
      }
    } else {
      // If logged out, do not auto-mark subscribed even if key exists (defensive cleanup optional)
      // We could remove it to avoid confusion, but keep it so when user logs in again it's restored.
    }
  }, []);

  // If user logs in later we still keep message; if user logs out we can still show message (persisted)
  // Provide a manual verification when user enters email (blur) or when status unclear
  const verifyEmail = async (emailToCheck) => {
    if(!emailToCheck) return;
    try {
      const res = await fetch(`http://localhost:5000/api/subscribe/check?email=${encodeURIComponent(emailToCheck)}`);
      const data = await res.json();
      if(res.ok && data.subscribed){
        setSubscribed(true);
        setCurrentEmail(data.email);
        localStorage.setItem('subscribedEmail', data.email);
        setStatus({ type:'ok', msg: `Already subscribed to ${data.email}` });
      }
  } catch { /* silent */ }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
        }
      });

      tl.from('.footer-brand h2', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      })
      .from('.footer-brand p', {
        opacity: 0,
        x: -40,
        duration: 0.6,
        ease: 'power2.out'
      }, "-=0.4")
      .from('.footer-links, .footer-socials, .footer-newsletter', {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out'
      }, "-=0.4")
      .from('.social-icons a', {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, "-=0.6")
      .from('.footer-newsletter input, .footer-newsletter button', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5
      }, "-=0.4")
      .from('.footer-bottom', {
        opacity: 0,
        y: 20,
        duration: 0.5
      }, "-=0.3");
    }, footerRef);

    return () => ctx.revert(); // clean up on unmount
  }, []);

  return (
    <footer className="footer-section" ref={footerRef}>
      <div className="footer-container">
        <div className="footer-brand">
          <h2>🔥 DineSync</h2>
          <p>Feeding your cravings with spice, love & glow!</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><button type="button" onClick={()=>navigate('/')} className="footer-link-btn">🏠 Home</button></li>
            <li><button type="button" onClick={()=>navigate('/menu')} className="footer-link-btn">🍽 Menu</button></li>
            <li><button type="button" onClick={() => {
              if(location.pathname !== '/') {
                navigate('/');
                // wait for navigation then scroll
                setTimeout(()=>{
                  const el = document.getElementById('specialties');
                  if(el){ el.scrollIntoView({ behavior:'smooth', block:'start' }); }
                }, 60);
              } else {
                const el = document.getElementById('specialties');
                if(el){ el.scrollIntoView({ behavior:'smooth', block:'start' }); }
              }
            }} className="footer-link-btn">🌟 Specials</button></li>
            <li><button type="button" onClick={()=>navigate('/contact')} className="footer-link-btn">📞 Contact</button></li>
          </ul>
        </div>

        <div className="footer-socials">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#">📘</a>
            <a href="#">📸</a>
            <a href="#">🐦</a>
            <a href="#">▶️</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h3>Get Updates</h3>
          {!subscribed && (
      <form onSubmit={async (e)=>{
            e.preventDefault();
            if(submitting) return;
            setStatus(null);
            const token = localStorage.getItem('token');
            const useEmail = email.trim();
            if(!useEmail){ setStatus({type:'err', msg:'Email required'}); return; }
            try {
              setSubmitting(true);
              console.log('[Subscribe] submitting', useEmail);
              const res = await fetch('http://localhost:5000/api/subscribe', {
                method:'POST',
                headers:{ 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
                body: JSON.stringify({ email: useEmail })
              });
              const data = await res.json().catch(()=>({}));
              console.log('[Subscribe] response status', res.status, data);
              if(!res.ok){ throw new Error(data.error || 'Failed'); }
              // Custom message if user not logged in
              if(!token){
                const baseMsg = (data.message === 'Already subscribed') ? 'Already subscribed to' : 'Subscribed to';
                setStatus({type:'ok', msg: `${baseMsg} ${useEmail}`});
              } else {
                setStatus({type:'ok', msg:data.message || 'Subscribed'});
              }
              setEmail(''); // clear field after success
        // Mark subscribed & persist
        if(token){
          localStorage.setItem('subscribedEmail', useEmail);
        }
        setSubscribed(true);
              setCurrentEmail(useEmail);
            } catch(err){
              console.error('[Subscribe] error', err);
              setStatus({type:'err', msg: err.message});
            } finally {
              setSubmitting(false);
            }
          }}>
            <input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} onBlur={()=>verifyEmail(email.trim())} required />
            <button type="submit" disabled={submitting} style={submitting? {opacity:.6, cursor:'not-allowed'}:undefined}>{submitting? 'Submitting...' : 'Subscribe'}</button>
          </form>
      )}
          {status && <div className={`newsletter-status ${status.type}`}>{status.msg}</div>}
          {subscribed && !status && currentEmail && (
            <div className="newsletter-status ok">Already subscribed to {currentEmail}</div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DineSync. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
