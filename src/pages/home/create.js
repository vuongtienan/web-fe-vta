import { Link } from 'react-router-dom'

const Create = () => {
  return (
    <div className='home-create'>
      <div className='home-create-container'>
        <Link to='/' className='home-create-user_avt'>
          <img src='/images/test/item.jpeg' />
        </Link>
        <div className='home-create-direct'>
          <Link to='/'>
            <span>
              Thêm bài đăng?
            </span>
            <i className="fas fa-feather"></i>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Create