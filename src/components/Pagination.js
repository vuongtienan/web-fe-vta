
const Pagination = (props) => {
  const { page, totalPage } = props
  const pageArr = Array.from(new Array(totalPage))
  
  return (
    <div id='pagination'>
      <ul>
        <li onClick={() => props.changePage(page - 1)} hidden={page === 1}>
          <i className="fas fa-chevron-left"></i>
        </li>
        {
          pageArr.map((item, index) => (
            <li onClick={() => props.changePage(index + 1)} style={{borderColor: index + 1 !== page ? 'rgb(189, 112, 50)' : 'transparent'}} key={index}>{index + 1}</li>
          ))}
        <li onClick={() => props.changePage(page+1)} hidden={page === totalPage}>
          <i className="fas fa-chevron-right"></i>
        </li>
      </ul>
    </div>
  )
}

export default Pagination