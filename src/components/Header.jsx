import torqueLogo from "../imgs/torqueLogo.png";

export default function Header() {
  return (
    <div className="header">
      <div className="header-border-box">
        <img src={torqueLogo} style={{ height: "3.5em", width: "3.5em" }}></img>
        <h4 className="header-name">Torque Hours</h4>s
      </div>
    </div>
  );
}
