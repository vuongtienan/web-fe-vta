import { Link } from 'react-router-dom'

const Footer = (props) => {
    const { site } = props
    return (
        <>
            <div id='footer'>
                <div className='footer-container'>
                    <div className='footer-data'>
                        <div className='footer-logo'>
                            <Link to='/'>
                                <img src='/images/pageLogo.png' alt='logo' />
                            </Link>
                        </div>
                        <p className='footer-desc'>
                            {site.admin}
                        </p>
                        <p className='footer-desc'>
                            {site.uni}
                        </p>
                        <div className='footer-networks'>
                            <a href={`https://www.facebook.com/hoangminhson317tdmu`}>
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href={`https://www.youtube.com/channel/UCD9xTIFxtEFrihXrz4Vh7fA`}>
                                <i className="fab fa-google"></i>
                            </a>
                            <a href='https://www.instagram.com/anling682/'>
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href={`call to ${site.phone}`}>
                                <i className="fas fa-phone"></i>
                            </a>
                        </div>
                    </div>
                    <div className='footer-menu'>
                        <ul>
                            <li className='title'>Diễn đàn khác</li>
                            <li>
                            <a href={`https://cafedev.vn/`}>
                            CafeDev
                            </a>
                            </li>
                            <li>
                            <a href={`https://howkteam.vn/`}>
                            Howkteam
                            </a>
                            </li>
                            <li>
                            <a href={`https://hoclaptrinh.vn/`}>
                            Hoclaptrinh
                            </a>
                            </li>
                        </ul>
                        <ul>
                            <li className='title'>Trường Đại học Thủ Dầu Một</li>
                            <li>
                                <Link to='/posts'>
                                    Viện Kỹ thuật - Công nghệ
                                </Link>
                            </li>
                            <li>
                                <Link to='/posts'>
                                    Ngành Kỹ thuật phần mềm
                                </Link>
                            </li>
                            <li>
                                <Link to='/posts'>
                                    Website chia sẽ kiến thức học tập
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <p className='footer-copyright'> © 2023. Đã đăng ký bản quyền</p>
            </div>
        </>
    )
}

export default Footer
