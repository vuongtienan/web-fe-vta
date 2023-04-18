// const endpoint = process.env.REACT_APP_API_ENDPOINT || 'https://manhbui-testdeploy-mblog.herokuapp.com'
export default (path) => {
  if (path && path !== 'null')
    return path
  else
    return '/images/defaultimg.jpg'
}