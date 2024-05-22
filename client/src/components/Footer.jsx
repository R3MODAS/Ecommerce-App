import {Link} from "react-router-dom"
import FOOTER_LINKS from "../assets/footer_links"

const Footer = () => {
  return (
    <footer>
        <div>
          <div>
            <Link to="/" className="mb-10 bold-20">Shoppee</Link>
            <div>
              {FOOTER_LINKS.map((col) => (
                <FooterColumn title={col.title} key={col.title}>
                  <ul>
                    {col.links.map((link))}
                  </ul>
                </FooterColumn>
              ))}
            </div>
          </div>
        </div>
    </footer>
  )
}

export default Footer

const FooterColumn = ({title, children}) => {
  return(
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  )
}