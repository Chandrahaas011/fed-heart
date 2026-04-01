import { Link } from "react-router-dom";

function Navbar() {
  const styles = {
    nav: {
      backgroundColor: "#000000",
      padding: "18px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #ff0000",
    },
    logo: {
      color: "#ff0000",
      fontSize: "24px",
      fontWeight: "bold",
      textDecoration: "none",
    },
    links: {
      display: "flex",
      gap: "30px",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "500",
    },
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        FedHeart
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/login" style={styles.link}>Hospital Login</Link>
        <Link to="/predict" style={styles.link}>Prediction</Link>
        <Link to="/about" style={styles.link}>About</Link>
      </div>
    </nav>
  );
}

export default Navbar;