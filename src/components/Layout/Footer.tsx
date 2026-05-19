export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">BEEscore</div>
          <p className="footer-tagline">South Africa&apos;s B-BBEE Compliance Platform</p>
        </div>
        <div>
          <p className="footer-heading">Resources</p>
          <ul className="footer-list">
            <li><a href="https://www.gov.za/documents/broad-based-black-economic-empowerment-act" target="_blank" rel="noopener noreferrer">B-BBEE Act</a></li>
            <li><a href="https://www.thedtic.gov.za/economic-empowerment/b-bbee/" target="_blank" rel="noopener noreferrer">DTI Guidelines</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Legal</p>
          <ul className="footer-list">
            <li><a href="#">Disclaimer</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {year} BEEscore. For informational purposes only.</span>
        <span>Not a substitute for formal B-BBEE verification.</span>
      </div>
    </footer>
  );
}
