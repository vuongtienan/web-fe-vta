import { connect } from 'react-redux'




const mapStateToProps = state => {
  return {
    web: state.web
  }
}

const mapActionToProps = {
  
}

const Header = connect(mapStateToProps)(HeaderSelector)