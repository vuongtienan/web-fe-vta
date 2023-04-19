
export default (path) => {
  if (path && path !== 'null')
    return path
  else
    return '/images/defaultimg.jpg'
}