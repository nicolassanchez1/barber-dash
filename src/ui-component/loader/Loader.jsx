import { useSelector } from 'react-redux';

import loaderGif from '../../assets/images/beer.gif';


const Loader = () => {
  const { loader } = useSelector((state) => state.loader);

  if (!loader) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <img src={loaderGif} alt="Cargando..." width={150} height={150} />
    </div>
  );
};

export default Loader;

