import { Link } from 'react-router-dom'
import MySlick from '../../global/Slick'
import getImage from '../../utils/getImage'

const Collection1 = (props) => {
    const { posts } = props
    
    const responsive = [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 0,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },

    ]

    const settings = {
        centerPadding: '30px',
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive
    }

    const arr = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ]

    return <>
        <div id='collection1'>
            <div className='collection1-container'>
                <h1 className='collection1-title'>
                    Nổi Bật
                </h1>
                <MySlick settings={settings}>
                    {
                        posts.map((item, index) =>
                            <div key={item._id} className='item-container'>
                                <div className='item-content'>
                                    <div className='item-thumb'>
                                        <Link to={`/posts/${item.slug}`}>
                                            <img src={getImage(item.image)} alt='img' />
                                        </Link>
                                    </div>
                                    <div className='item-title'>
                                        <Link to={`/posts/${item.slug}`} className='item-title-title'>
                                            {item.title}
                                        </Link>
                                        <p className='item-title-desc'>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </MySlick>

            </div>
        </div>
    </>
}

export default Collection1