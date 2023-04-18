import MainTemplate from '../../layouts/MainLayout'
import PostListSelector from '../../components/postList'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../utils/axios'
import toSlug from '../../utils/toSlug'
import { connect } from 'react-redux'
import { toggleLoading } from '../../redux/actions/webActions'

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const SearchSelector = (props) => {
  const param = useQuery().get('q')
  const slug = toSlug(param)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    props.toggleLoading(true)
    api('GET', `api/search/${slug}`)
      .then(res => {
        if (res.data && res.data.status) {
          setPosts(res.data.posts)
          props.toggleLoading(false)
        }
      })
  }, [])

  return (
    <MainTemplate>
      {
        posts && posts.length > 0 &&
        <>
          <div className='search-result'>
            <p>Kết quả cho '{param}' : </p>
          </div>
          <PostListSelector posts={posts} search={true} />
        </>
        ||
        <div className='search-result'>
          <p style={{ color: 'rgb(223, 83, 83)' }}>Không tìm thấy kết quả cho '{param}'!</p>
        </div>
      }
    </MainTemplate>
  )
}

const mapStateToProps = (state) => ({
  web: state.web
})

const mapActionToProps = {
  toggleLoading
}

const Search = connect(mapStateToProps, mapActionToProps)(SearchSelector)
export default Search