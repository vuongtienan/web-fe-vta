import { Link, useHistory } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef } from 'react'
import moment from 'moment'
import getImage from '../utils/getImage'
import { connect } from 'react-redux'
import { toggleLoading } from '../redux/actions/webActions'
import api from '../utils/axios'

const PostListSelector = (props) => {
  const history = useHistory()
  const { web } = props

  const { posts } = props
  const [comment, setComment] = useState(null)
  const [cmtLoading, setCmtLoading] = useState(false)
  const [commentList, setCommentList] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deletedPost, setDeletedPost] = useState({})
  const isAdmin = web.user.role
  console.log(isAdmin, props.author, web)
  const commentEl = useRef(null)

  const toggleComment = (index, postId) => {
    if (index === comment) {
      setComment(null)
    } else {
      getComment(postId)
      setComment(index)
    }
  }

  const toggleDeleteForm = (info) => {
    setDeleteConfirm(!deleteConfirm)
    setDeletedPost(info)
  }

  const getComment = (postId) => {
    setCmtLoading(true)
    api("GET", `api/posts/comment/${postId}?page=${1}`)
      .then(res => {
        if (res.data && res.data.status) {
          if (res.data.comments && res.data.comments.length > 0) {
            setCommentList(res.data.comments)
          }
        } else {
          setCommentList([])
        }
      })
      .catch(err => console.log(err))
      .then(() => {
        setCmtLoading(false)
      })
  }

  const sendComment = (item, index) => {
    const postId = item._id
    setCmtLoading(true)
    const value = commentEl.current.value

    const postData = {
      postId: postId,
      content: value
    }

    api('POST', `/api/posts/comment/${postId}`, postData)
      .then(res => {
        if (res.data && res.data.status) {
          const commentCount = [...item.comment]
          
          const newId = String(res.data.newCommentId)
          commentCount.push({ _id: newId })

          const newPostList = [
            ...posts.slice(0, index),
            {
              ...item,
              comment: commentCount
            },
            ...posts.slice(index + 1)
          ]
          props.setPosts(newPostList)

          commentEl.current.value = ''

          let newComtList = commentList
          if (newComtList.length > 3)
            newComtList = [...commentList.slice(1)]
          setCommentList(
            [
              ...newComtList,
              {
                user: {
                  _id: web.user.userId,
                  firstName: web.user.firstName,
                  lastName: web.user.lastName,
                  image: web.user.userImage
                },
                ...postData,
                _id: newId
              }
            ]
          )
        } else {
          if (res.data.message === 'khong the lay token') {
            history.replace({ pathname: '/sign-in' })
          }
        }
      })
      .catch(err => console.log(err))
      .then(() => {
        setCmtLoading(false)
      })
  }

  const deletePost = (postId, authorId, title) => {

    api('POST', `api/posts/delete/${postId}`, { postId, authorId })
      .then(res => {
        if (res.data && res.data.status) {
          setDeleteConfirm(false)
          props.removeEl(postId)
        }
      })
      .catch(err => {
        console.log(err)
        alert('Error!')
      })
  }

  const deleteComment = (item, commentId, index) => {
    const postId = item._id

    api('GET', `api/posts/u/delete-comment?commentId=${commentId}&postId=${postId}&userId=${web.user.userId}`)
      .then(res => {
        if(res.data && res.data.status) {
          let commentCount = [...item.comment]
          commentCount = commentCount.filter(x => x._id !== commentId)
  
          const newPostList = [
            ...posts.slice(0, index),
            {
              ...item,
              comment: commentCount
            },
            ...posts.slice(index + 1)
          ]
          props.setPosts(newPostList)
  
          getComment(postId)
        }
      })
  }

  return <div className='postList'>
    <div style={{ display: deleteConfirm ? 'block' : 'none' }} className='delete-confirm'>
      <div className='confirm-container'>
        <p>Bạn có chắc chắn muốn xoá bài đăng?</p>
        <div className='btns'>
          <button onClick={() => deletePost(deletedPost._id, deletedPost.author._id)} className='delete'>Xoá</button>
          <button onClick={() => setDeleteConfirm(!deleteConfirm)} >Trở về</button>
        </div>
      </div>
    </div>
    <div className='postList-container'>
      {
        posts && posts.length > 0 && posts.map((item, index) => {
          return (
            <div key={item._id} className='postList-list'>
              <div className='mb-user-info'>
                <Link to={`/posts/${item.slug}`}>{item.author && item.author.firstName}</Link>
                <span> - {moment(item.createDate).format('DD/MM/YYYY')}</span>
              </div>
              <div className='postList-list-container'>
                <div className='info-container'>
                  <div className='user-container'>
                    <Link to={`/posts/${item.slug}`}>
                      <img src={getImage(item.image)} />
                    </Link>
                    <Link to={`/posts/${item.slug}`} className='username'>
                      {item.author && item.author.firstName}
                    </Link>
                  </div>
                  <div className='create-time'>
                    <span>{moment(item.createDate).format('DD/MM/YYYY')}</span>
                  </div>
                </div>
                <div className='content-container'>
                  {
                    props.author &&
                    <div className='author-role'>
                      <Link to={`/posts/update/${item._id}`} style={{ color: 'rgb(84, 84, 216)' }}>Chỉnh sửa</Link>
                      <button onClick={() => toggleDeleteForm(item)} className='delete'>
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </div>
                  }
                  {
                    isAdmin === 'admin' && !props.author &&
                    <div className='author-role'>
                      <button onClick={() => toggleDeleteForm(item)} className='delete'>
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </div>
                  }
                  <Link to={`/posts/${item.slug}`} className='post-title'>
                    {item.title}
                  </Link>
                  <p className='category'>{item.category?.name || 'null'}</p>
                  <p className='content'>
                    {item.description}
                  </p>
                  <Link to={`/posts/${item.slug}`} className='read-more'>
                    Xem tiếp...
                  </Link>
                  {
                    !props.search &&
                    <>
                      <div className='tools'>
                        <button onClick={() => props.likeHandle(item, index)} className='like'>
                          {
                            item.liked &&
                            <>
                              <i className="fas fa-heart"></i>
                              <span>{`You ${item.like && item.like.length > 1 ? `and ${item.like.length - 1} others` : ''}`}</span>
                            </>
                            ||
                            <>
                              <i className="far fa-heart"></i>
                              <span>{`${item.like && item.like.length === 0 ? `Like this post` : `${item.like.length} people`}`}</span>
                            </>
                          }
                        </button>
                        <button className={comment === index ? 'comment active' : 'comment'} onClick={() => toggleComment(index, item._id)}>
                          <i className="far fa-comments"></i>
                          <span>{item.comment && item.comment.length || 0}</span>
                        </button>
                        <button className='share' >
                        
                          <i className="fas fa-share"></i>
                        </button>
                        <button className='add'>
                          <i className="far fa-plus-square"></i>
                        </button>
                      </div>
                      {
                        comment === index &&
                        <div className='comments active'>
                          <div className='comment-list'>
                            {
                              commentList && commentList.length > 0 &&
                              <ul>
                                {
                                  commentList.map((comment, commentIndex) => (
                                    <li key={comment._id} className='comment-item'>
                                      {
                                        (isAdmin === 'admin' || (comment.user && comment.user._id === web.user.userId)) && <button onClick={() => deleteComment(item, comment._id, index)} className='postList-delete-comt'><i className="far fa-trash-alt"></i></button>
                                      }
                                      <div className='comment-author'>
                                        <Link to={`/`}>
                                          <img src={getImage(comment.user && comment.user.image || null)} />
                                        </Link>
                                        <Link to={`/`}>
                                          {`${comment.user && comment.user.firstName} ${comment.user && comment.user.lastName}`}
                                        </Link>
                                      </div>
                                      <div className='comment-content'>
                                        <p>
                                          {comment.content}
                                        </p>
                                      </div>
                                    </li>
                                  ))
                                }
                                {
                                  cmtLoading &&
                                  <li className='postList-comment-loading'>
                                    <img src='/images/cmtloading.gif' />
                                  </li>
                                }
                              </ul>
                              ||
                              <p className='comemnt-list comment-alert'>Chưa có bình luận nào, hãy bình luận cho bài viết?</p>
                            }
                          </div>
                          <div className='user-comment'>
                            <img src={getImage(web.user.userImage)} />
                            <div className='comment-input-container'>
                              <TextareaAutosize id={item._id} key={item._id} ref={commentEl} placeholder='Viết bình luận...' className='comment-input' />
                              <button onClick={() => sendComment(item, index)}>
                                <i className="far fa-paper-plane"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      }
                    </>
                  }
                </div>
              </div>
              <hr className='boundary' />

            </div>
          )
        }
        )
        ||
        <p>Không có bài đăng nào...</p>
      }
    </div>
  </div>
}

const mapStateToProps = state => ({
  web: state.web
})

const mapActionToProps = {
  toggleLoading
}

const PostList = connect(mapStateToProps, mapActionToProps)(PostListSelector)
export default PostList