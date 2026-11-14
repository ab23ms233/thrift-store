import "./Footer.css"

function Footer() {
    return (
        <footer className="app-footer">
            <div className="developer-cont">
                <span className="developed-by">Developed by </span>
                <strong className="developer-name">Arya Basak</strong>
            </div>
            <div className="footer-links-cont">
                <ul className="footer-links">
                    <a className="footer-link" href="mailto:ab23ms233@iiserkol.ac.in">
                        ab23ms233@iiserkol.ac.in
                    </a>
                    <span className="footer-line">|</span>
                    <a href="" className="footer-link">
                        Report a bug
                    </a>
                    <span className="footer-line">|</span>
                    <a href="https://github.com/ab23ms233/thrift-store" target="_blank" className="footer-link">
                        Source Code
                    </a>
                </ul>
            </div>
        </footer>
    )
}

export default Footer