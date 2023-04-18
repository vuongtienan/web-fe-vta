import MainTemplate from '../../layouts/MainLayout'
import FilterSelector from './filter'
import PostList from '../../components/postList'
import Pagination from '../../components/Pagination'
import api from '../../utils/axios'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { toggleLoading } from '../../redux/actions/webActions'

const PostSelector = (props) => {
    const { web } = props
    const [posts, setPosts] = useState([])
    const [totalPosts, setTotalPosts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [currentCate, setCurrentCate] = useState(null)
    const [currentDate, setCurrentDate] = useState(null)

    const filter = (query) => {
        const { category, date } = query
        setCurrentCate(category)
        setCurrentDate(date)

        let url = '/api/posts?'

        if (category) {
            url = url + `category=${category}&`
        }

        if (date) {
            url = url + `sortDate=${date}&`
        }

        props.toggleLoading(true)
        api('GET', `${url}page=${1}`)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data && res.data.posts && res.data.posts.length > 0) {
                        const postsData = res.data.posts
                        const newPostsData = postsData.map((item) => {
                            let liked = false
                            if (item.like.filter(x => x._id === web.user.userId).length > 0) {
                                liked = true
                            }
                            return {
                                ...item,
                                liked
                            }
                        })

                        setPosts(newPostsData)
                        setCurrentPage(res.data.page)
                        setTotalPage(res.data.totalPage)
                        setTotalPosts(res.data.totalPost)
                    } else {
                        setPosts([])
                        setTotalPosts(0)
                    }
                }
            })
            .catch(err => console.log(err))
            .then(() => {
                props.toggleLoading(false)
            })
    }

    const changePage = (page) => {
        const category = currentCate
        const date = currentDate

        let url = '/api/posts?'

        if (category) {
            url = url + `category=${category}&`
        }

        if (date) {
            url = url + `sortDate=${date}&`
        }

        props.toggleLoading(true)
        api('GET', `${url}page=${page}`)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data && res.data.posts && res.data.posts.length > 0) {
                        const postsData = res.data.posts
                        const newPostsData = postsData.map((item) => {
                            let liked = false
                            if (item.like.filter(x => x._id === web.user.userId).length > 0) {
                                liked = true
                            }
                            return {
                                ...item,
                                liked
                            }
                        })
                        setPosts(newPostsData)
                        setCurrentPage(res.data.page)
                        setTotalPage(res.data.totalPage)
                        setTotalPosts(res.data.totalPost)
                    } else {
                        setPosts([])
                        setTotalPosts(0)
                    }
                }
            })
            .catch(err => console.log(err))
            .then(() => {
                props.toggleLoading(false)
            })
    }

    const like = (id) => {
        api('POST', `api/posts/like/${id}`)
    }

    const unlike = (id) => {
        api('POST', `api/posts/unlike/${id}`)
    }

    const likeHandle = (item, index) => {
        const likeList = item.like
        const PostId = item._id
        const userId = web.user.userId
        const result = likeList.filter(e => e._id === userId).length > 0
        let newPosts
        if (result) {
            console.log('unlike')
            unlike(PostId)
            const newLikeList = likeList.filter(x => x._id !== userId)
            newPosts = [
                ...posts.slice(0, index),
                {
                    ...item,
                    liked: false,
                    like: newLikeList
                },
                ...posts.slice(index + 1)
            ]
        } else {
            console.log('like')
            like(PostId)
            likeList.push({_id: userId})

            newPosts = [
                ...posts.slice(0, index),
                {
                    ...item,
                    liked: true,
                    like: likeList
                },
                ...posts.slice(index + 1)
            ]
        }

        setPosts(newPosts)
    }

    const removePost = (postId) => {
        const newList = posts.filter(x => x._id !== postId)
        setPosts(newList)
    }

    useEffect(() => {
        props.toggleLoading(true)
        api('GET', `/api/posts?page=${1}`)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data && res.data.posts && res.data.posts.length > 0) {
                        const postsData = res.data.posts
                        const newPostsData = postsData.map((item) => {
                            let liked = false
                            if (item.like.filter(x => x._id === web.user.userId).length > 0) {
                                liked = true
                            }
                            return {
                                ...item,
                                liked
                            }
                        })
                        setPosts(newPostsData)
                        setCurrentPage(res.data.page)
                        setTotalPage(res.data.totalPage)
                        setTotalPosts(res.data.totalPost)
                    }
                }
            })
            .catch(err => console.log(err))
            .then(() => {
                props.toggleLoading(false)
            })
    }, [])

    return (
        <>
            <MainTemplate>
                <FilterSelector totalFilter={filter} length={posts.length} total={totalPosts} />
                <PostList removeEl={removePost} setPosts={setPosts} likeHandle={likeHandle} posts={posts} />
                {
                    posts && posts.length > 0 &&
                    <Pagination changePage={changePage} page={currentPage} totalPage={totalPage} />
                }
            </MainTemplate>
        </>
    )
}

const mapStateToProps = (state) => ({
    web: state.web
})

const mapActionToProps = {
    toggleLoading
}

const Post = connect(mapStateToProps, mapActionToProps)(PostSelector)

export default Post