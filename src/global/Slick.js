import Slider from "react-slick"

const MySlick = (props) => {
    const settings = props.settings || {}

    return (
        <Slider {...settings} >
            {props.children}
        </Slider>
    )
}

export default MySlick