import { Link } from 'react-router-dom'
import getImage from '../../utils/getImage'

const Latest = (props) => {
    const { posts } = props
    return (
        <>
            <div id='latest'>
                <h1 className='latest-title'>
                    Mới nhất
                </h1>
                <div className='posts-container'>
                    {/* post 1 */}
                    {
                        posts && posts.length > 1 &&
                        <div className='first-container'>
                            <div className='first-thumb'>
                                <Link to={`posts/${posts[0].slug}`}>
                                    <img src={getImage(posts[0].image)} alt='img' />
                                </Link>
                            </div>
                            <div className='first-infor'>
                                <Link to={`posts/${posts[0].slug}`} className='first-category'>
                                    {posts[0].category && posts[0].category.name.toUpperCase() || "Đang cập nhật"}
                                </Link>
                                <Link to={`posts/${posts[0].slug}`} className='first-title'>
                                    {posts[0].title}
                                </Link>
                                <p className='first-desc'>
                                    {posts[0].description}
                                </p>
                            </div>
                        </div>
                    }
                    <div className='next-container'>
                        <div className='row'>
                            {/* next 3 */}
                            {
                                posts && posts.length > 4 &&
                                posts.map((item, index) => {
                                    if (index > 2 && index < 6) {
                                        return (
                                            <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4'>
                                                <div className='next-content'>
                                                    <div className='next-thumb'>
                                                        <Link to={`posts/${item.slug}`}>
                                                            <img src={getImage(item.image)} alt='img' />
                                                        </Link>
                                                    </div>
                                                    <div className='next-infor'>
                                                        <Link to={`posts/${item.slug}`} className='next-title'>
                                                            {item.title}
                                                        </Link>
                                                        <p className='next-desc'>
                                                            {item.description}
                                                        </p>
                                                        <Link to='/' className='next-category'>{item.category && item.category.name.toUpperCase() || 'Đang cập nhật'}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                            {
                                posts && posts.length > 6 &&
                                posts.map((item, index) => {
                                    if (index > 4 && index < 7) {
                                        return (
                                            < div className='col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6'>
                                                <div className='next-content sec'>
                                                    <div className='next-thumb'>
                                                        <Link to={`posts/${item.slug}`}>
                                                            <img src={getImage(item.image)} alt='img' />
                                                        </Link>
                                                    </div>
                                                    <div className='next-infor'>
                                                        <Link to={`posts/${item.slug}`} className='next-title'>
                                                            {item.title}
                                                        </Link>
                                                        <p className='next-desc'>
                                                            {item.description}
                                                        </p>
                                                        <Link to='/' className='next-category'>{item.category && item.category.name.toUpperCase() || 'Đang cập nhật'}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                <Link to='/' className='latest-seemore'>Xem thêm...</Link>
            </div>
        </>
    )
}

export default Latest