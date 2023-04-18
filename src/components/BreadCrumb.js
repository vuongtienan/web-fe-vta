import { Link } from 'react-router-dom'

const BreadCumb = (props) => {

  const { category, detail } = props

  return (
    <div id='main_bread-crumb'>
      <div className='bc-container'>
        <ul>
          <li className='bc-home'>
            <Link to='/'>
              <i className="fas fa-home"></i>
            </Link>
          </li>
          <li className='bc-category'>
            <Link to='/'>
              <span>
                {category || ''}
              </span>
            </Link>
          </li>
          <li className='bc-detail'>
            <span>
              {detail || ''}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BreadCumb