import logo from 'assets/images/barber-logo.png';

export default function Logo({isSection = false}) {
  return <img src={logo} alt="HZ" width={isSection ? '30%' : '100%'} />;
}
