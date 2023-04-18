import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import SearchModal from './SearchModal'

import { connect } from 'react-redux'
import getImage from '../utils/getImage'

const HeaderSelector = (props) => {
  const { asPath, web } = props
  const [childMenu, setChildMenu] = useState(false)
  const [searchForm, setSearchForm] = useState(false)
  const [mbMenu, setMbMenu] = useState(false)
  const isAdmin = web.user.role
  console.log(isAdmin, props.author, web)
  
  const fakeMenu = {
    menu: [
      {
        id: 1,
        name: 'Trang chủ',
        path: '/',
      },
      {
        id: 2,
        name: 'Bài đăng',
        path: '/posts',
      },
    ],
  }
  
  const toggleChildMenu = () => {
    setChildMenu(!childMenu)
  }

  const toggleSearchForm = () => {
    setSearchForm(!searchForm)
  }

  const toggleMobileMenu = () => {
    setMbMenu(!mbMenu)
  }

  return (

    <>
      <div className='header'>
        <SearchModal toggleSearchForm={toggleSearchForm} status={searchForm ? true : false} />
        <div className='header-container'>
          <ul className='header-menu'>
            {
              fakeMenu.menu.map(item =>
                <li key={item.id} className={item.path === asPath ? 'header-menu-item active' : 'header-menu-item'}>
                  <Link to={item.path}>
                    {item.name}
                  </Link>
                </li>
                
              )
            }
          </ul>
          <div className='header-logo-container'>
            <Link to='/'>
              <img src='/images/pageLogo.png' id='site-logo' alt='MBlog' />
            </Link>
          </div>
          <div className='right-side-container'>
          {
                    isAdmin === 'admin' && !props.author &&
                    
                    <div className='author-role'>
                    <Link to='/posts/create' className='header-create'>
              <span>Tạo bài đăng</span>
              <i className="fas fa-feather"></i>
            </Link>
                    </div>
                  }
                  {
                    isAdmin === 'user'  &&
                    <div className='author-role'>
                    <Link to='/posts/create' className='header-create'>
              <span>Tạo bài đăng</span>
              <i className="fas fa-feather"></i>
            </Link>
                    </div>
                  }
           
            <button onClick={setSearchForm} className='search-btn'>
              <i className="fas fa-search"></i>
            </button>
            {
              !web.logged ?
                <div className='sign-container'>
                  <Link to='/sign-in' className='sign-btn'>
                    Đăng nhập
                  </Link>
                  <Link to='/sign-up' className='sign-btn active'>
                    Đăng ký
                  </Link>
                </div>
                :
                <div className='user-profile'>
                  <img className='user-avt' src={getImage(web.user.userImage)} alt='user' />
                  <Link to='/me'>
                    {`${web.user.firstName} ${web.user.lastName}`}
                  </Link>
                </div>
            }
            

          </div>
          
        </div>
        <div className='slogan'><p><h2>Studying Together - Nơi cộng đồng nâng cao kiến thức lập trình</h2></p></div>



        {/* MOBILE */}
        <div className='mb-header-container'>
          <div onClick={toggleMobileMenu} className={mbMenu ? 'header-overlay active' : 'header-overlay'}></div>
          <div className={mbMenu ? 'mb-side-menu active' : 'mb-side-menu'}>
            <div className='mb-side-menu-header'>
              <i onClick={toggleMobileMenu} className="fas fa-times hide-side-menu-icon"></i>
              {
                !web.logged ?
                  <div className='mb-sign-container'>
                    <Link to='/sign-up' className='mb-sign-btn'>
                      Đăng nhập
                    </Link>
                    <Link to='/sign-in' className='mb-sign-btn active'>
                      Đăng ký
                    </Link>
                  </div>
                  :
                  <div className='user-profile'>
                    <img className='user-avt' src={getImage(web.user.userImage)} alt='user' />
                    <Link to='/me'>
                      {`${web.user.firstName} ${web.user.lastName}`}
                    </Link>
                  </div>
              }
            </div>
            <button style={{marginLeft: 'auto', display: 'block'}} onClick={setSearchForm} className='search-btn'>
              <i className="fas fa-search"></i>
            </button>
            <ul className='mb-header-menu'>
              {
                fakeMenu.menu.map(item =>
                  <li key={item.id} className={item.path === asPath ? 'mb-header-menu-item active' : 'mb-header-menu-item'}>
                    <Link to={item.path}>
                      {item.name}
                    </Link>
                  </li>
                )
              }
            </ul>
          </div>
          <div className='mb-header-logo-container'>
            <Link to='/'>
              <img src='/images/pageLogo.png' id='site-logo' alt='MBlog' />
            </Link>
          </div>
          <button onClick={toggleMobileMenu} className='mb-menu-btn active'>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </>
  )

}

const mapStateToProps = state => {
  return {
    web: state.web
  }
}

const Header = connect(mapStateToProps)(HeaderSelector)

export default Header