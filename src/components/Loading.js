import { connect } from 'react-redux'
import { toggleLoading } from '../redux/actions/webActions'

const LoadingSelector = (props) => {
  
  return (
    <div id='page-loading' style={{display: props.web.loading ? 'block' : 'none'}}>
      <img src='/images/loading.gif' />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    web: state.web
  }
}

const mapActionToProps = {
  toggleLoading
}

const Loading = connect(mapStateToProps, mapActionToProps)(LoadingSelector)
export default Loading
