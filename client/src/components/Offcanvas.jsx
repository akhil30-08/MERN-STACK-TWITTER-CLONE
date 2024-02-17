//importing offcanvas items
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { navLinks } from '../constants/index.js';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const OffCanvas = () => {
  //offcanvas state
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const { pathname } = useLocation();
  return (
    <>
      <Button
        variant='light'
        onClick={toggleShow}
        className='me-2 d-block d-md-none'
      >
        <i className='fa-solid fa-bars'></i>
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        className='w-50'
        scroll='true'
        backdropClassName='true'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i
              className='fa-brands fa-twitter fa-md mx-4'
              style={{ color: 'rgb(22, 161, 225)' }}
            ></i>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <aside className='d-flex flex-column'>
            <ul>
              {navLinks.map((link) => {
                const isActive = pathname === link.route ? true : false;

                return (
                  <li
                    key={link.name}
                    className={`btn btn-primary home-button my-1 ${
                      isActive && 'activeLink'
                    }`}
                  >
                    <NavLink to={link.route} className='text-decoration-none'>
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </aside>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvas;
