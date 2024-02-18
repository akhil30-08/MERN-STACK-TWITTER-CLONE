import { Outlet, useLocation } from 'react-router-dom';
import '../css/login.css';

const AuthLayout = () => {
  const { pathname } = useLocation();

  return (
    <section className='d-flex justify-content-center align-items-center vh-100'>
      <div className='card mx-auto mt-2' style={{ width: '75vw' }}>
        <div className='card-body'>
          <div className='row' style={{ height: '100%' }}>
            <div
              className='col-12 col-md-5 d-flex flex-column justify-content-center align-items-center'
              id='left-box-login'
            >
              <h4>{pathname === '/' ? 'Welcome Back' : 'Join Us'}</h4>
              <div className='mt-2 me-4'>
                <i className='fa-brands fa-twitter fs-1'></i>
              </div>

              <i className='fa-solid fa-messages' />
            </div>

            <div className='col-12 col-md-7'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
