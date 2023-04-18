import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef, useEffect } from 'react'
import api from '../../utils/axios'
import toSlug from '../../utils/toSlug'
import { useHistory, Link, useParams } from 'react-router-dom'
import getImage from '../../utils/getImage'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { connect } from 'react-redux'

const defaultValue = {
  select: 'Chọn'
}

const UpdateEl = (props) => {
  const postId = useParams().postId || null

  const history = useHistory()

  const [title, setTitle] = useState(defaultValue.title)
  const [desc, setDesc] = useState(defaultValue.shortDesc)
  const [cate, setCate] = useState(defaultValue.category)
  const [file, setFile] = useState('')
  const [data, getData] = useState({ name: '', path: '/images/defaultimg.jpg' })
  const [categories, setCategories] = useState([])
  const [select, setSelect] = useState(false)
  const [originData, setOriginData] = useState({})

  const titleEl = useRef(null)
  const cateEl = useRef(null)
  const shortDescEl = useRef(null)
  const newCateEl = useRef(null)
  const sourceEl = useRef(null)
  const fileEl = useRef(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    props.dispatch({
      type: 'TOGGLE_LOADING',
      payload: true
    })

    api('GET', '/api/auth')
      .then(res => {
        if (res.data && !res.data.status) {
          setTimeout(() => {
            history.replace({ pathname: '/sign-in' })
          }, 1000)
        }
      })
      .then(() => {
        api('GET', 'api/posts/create')
          .then(res => {
            if (res.data && res.data.category) {
              setCategories(res.data.category)
            }
          })
      })
      .catch(err => console.log(err))
      .then(() => {
        props.dispatch({
          type: 'TOGGLE_LOADING',
          payload: false
        })
      })

    api('GET', `api/posts/update/${postId}`)
      .then(res => {
        if(res.data && res.data.status) {
          setOriginData(res.data.post)
          titleEl.current.value = res.data.post.title
          shortDescEl.current.value = res.data.post.description
          setContent(res.data.post.content)
          cateEl.current.value = JSON.stringify(res.data.post.category)
          setCate(res.data.post.category && res.data.post.category.name || 'Đang cập nhật')
          setTitle(res.data.post.title)
          setDesc(res.data.post.description)
          setFile(res.data.post.image)
          getData({
            ...data,
            path: getImage(res.data.post.image)
          })
        } else {

        }
      })
      .catch(err => console.log(err))

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    const currentTitle = titleEl.current.value
    const currentShortDesc = shortDescEl.current.value
    const currentSource = sourceEl.current.value.length > 0 && sourceEl.current.value || originData.source
    const cateObj = cateEl.current.value
    
    const slug = toSlug(currentTitle)
    const currentCate = cateObj !== defaultValue.select && JSON.parse(cateObj)
    const newFile = fileEl.current.value

    formData.append('title', currentTitle)
    formData.append('shortDesc', currentShortDesc)
    formData.append('content', content)
    formData.append('source', currentSource)
    currentCate && formData.append('categoryId', currentCate && currentCate._id || null)
    formData.append('image', newFile || originData.image)
    formData.append('author', originData.author && originData.author._id)
    formData.append('slug', slug)
    

    api('POST', `/api/posts/update/${originData._id}`, formData)
      .then(res => {
        if (res.data && res.data.status) {
          history.replace({ pathname: '/' })
        } else {
          alert(res.data.message)
        }
      })
      .catch(err => console.log('this is err: ', err))

  }

  const changeTitle = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.title
    }
    setTitle(value)
  }

  const createNewCate = (e) => {
    let value = e.target.value
    value = value.trim()
    if (value.length > 0) {
      setSelect(true)
      setCate(value)
    } else {
      if (cateEl.current.value !== defaultValue.select) {
        setCate(JSON.parse(cateEl.current.value).name)
      }
      setSelect(false)
    }
  }

  const changeCate = (e) => {
    let value = e.target.value
    value = JSON.parse(value)

    if (value.name === '') {
      value = originData.category && originData.category.name || 'Đang cập nhật'
    }

    setCate(value.name)
  }

  const handleChange = (e) => {
    const selectedFile = e.target.value && e.target.value.length > 0 && e.target.value || '/images/defaultimg.jpg'
    setFile(selectedFile)
  }

  const changeDesc = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.description
      e.target.value = JSON.stringify(originData.category)
    }
    setDesc(value)
  }

  return (
    <div className='create-post'>
      <div className='create-container'>
        <Link className='back-to-home' to='/'>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1> Chỉnh sửa bài viết</h1>
        <div className='row'>
          <div className='col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8'>
            <div className='create-form'>
              <div className='create-title'>
                <label htmlFor='create_title'>Tiêu đề</label>
                <input ref={titleEl} onChange={(e) => { changeTitle(e) }} placeholder='Tên bài đăng' id='create_title' />
                <p>Tiêu đề của bài viết...</p>
              </div>
              <div className='create-category'>
                <label htmlFor='crate-cate-select'>Thể loại:</label>
                <select disabled={select} onChange={(e) => changeCate(e)} id='create-cate-select' ref={cateEl} name="categories" id="categories">
                  {
                    categories && categories.length > 0 &&
                    categories.map(item =>
                      <option key={item.id} selected={item.id === originData && originData.category && originData.category._id || null} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    )
                    ||
                    <option defaultValue="">Thêm mới</option>
                  }
                </select>
                
              </div>
              <div className='create-img'>
                <label htmlFor='create_image'>Hình ảnh thu nhỏ</label>
                <input ref={fileEl} onChange={handleChange} id='create_image' />
                <p>Hình ảnh chính của bài đăng.</p>
              </div>
              <div className='create-shortdesc'>
                <label htmlFor='create_shortdesc'>Mô tả ngắn</label>
                <textarea ref={shortDescEl} onChange={(e) => { changeDesc(e) }} id='create_shortdesc' />
                <p>Mô tả ngắn của bài đăng, tối đa 512 ký tự</p>
              </div>
              <div className='create-source'>
                <label htmlFor='create_source'>Nguồn</label>
                <textarea ref={sourceEl} id='create_source' placeholder='Nếu bạn chia sẽ từ nguồn khác' />
              </div>
              <div className='create-content'>
                <label htmlFor='create_content'>Nội dung</label>
                <CKEditor
                className='about'
                    editor={ ClassicEditor }
                    data={content}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setContent(data)
                    } }
                    onBlur={ ( event, editor ) => {
                    } }
                    onFocus={ ( event, editor ) => {
                    } }
                />
                <p>Nội dung của bài đăng</p>
              </div>
              <button onClick={handleSubmit}>Cập nhập</button>
            </div>
          </div>
          <div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4'>
            <div className='create-demo'>
              <div className='first-container'>
                <div className='first-thumb'>
                <img onError={() => setFile("/images/defaultimg.jpg")} src={getImage(file)} alt='img' />
                </div>
                <div className='first-infor'>
                  <p to='/' className='first-category'>
                    {cate}
                  </p>
                  <span to='/' className='first-title'>
                    {title}
                  </span>
                  <p className='first-desc'>
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  web: state.web
})

const Update = connect(mapStateToProps)(UpdateEl)
export default Update