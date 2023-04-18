import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef, useEffect } from 'react'
import api from '../../utils/axios'
import toSlug from '../../utils/toSlug'
import { useHistory, Link, useLocation } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import getImage from '../../utils/getImage'

const defaultValue = {
  select: 'Chọn',
  title: 'Title',
  shortDesc: 'Describe',
  category: 'Category',
  source: null
}
  

const Create = () => {
  const history = useHistory()
  const [crawl, setcrawl] = useState(false)
  const [title, setTitle] = useState(defaultValue.title)
  const [desc, setDesc] = useState(defaultValue.shortDesc)
  const [cate, setCate] = useState(defaultValue.category)
  const [file, setFile] = useState('/images/defaultimg.jpg')
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [select, setSelect] = useState(false)
  const [content, setContent] = useState('')
  const titleEl = useRef(null)
  const cateEl = useRef(null)
  const shortDescEl = useRef(null)
  const newCateEl = useRef(null)
  const sourceEl = useRef(null)
  const fileEl = useRef(null)

  useEffect(() => {
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
  }, [])

  const handleChange = (e) => {
    const selectedFile = e.target.value && e.target.value.length > 0 && e.target.value || '/images/defaultimg.jpg'
    setFile(selectedFile)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    const currentTitle = titleEl.current.value
    const currentShortDesc = shortDescEl.current.value
    const currentcontent = content
    const cateObj = cateEl.current.value
    const file = fileEl.current.value
    const currentSource = sourceEl.current.value.length > 0 && sourceEl.current.value || null
    {/*const newCate = newCateEl.current.value.length > 0 && newCateEl.current.value || null*/}
    const slug = toSlug(currentTitle)
    const currentCate = cateObj !== defaultValue.select && JSON.parse(cateObj)

    formData.append('title', currentTitle)
    formData.append('shortDesc', currentShortDesc)
    formData.append('content', currentcontent)
    formData.append('source', currentSource)
    currentCate && formData.append('categoryId', currentCate._id)
    formData.append('image', file)
    formData.append('slug', slug)
    {/*newCate && formData.append('newCate', newCate)*/}

    api('POST', '/api/posts/create', formData)
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
      value = defaultValue.title
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
      } else {
        setCate(defaultValue.category)
      }
      setSelect(false)
    }
  }

  const changeCate = (e) => {
    let value = e.target.value
    value = JSON.parse(value)

    if (value.name === '') {
      value = defaultValue.category
    }

    setCate(value.name)
  }

  const changeDesc = (e) => {
    let value = e.target.value
    if (value === '') {
      value = defaultValue.shortDesc
    }
    setDesc(value)
  }

  return (
    <div className='create-post'>
      <div className='create-container'>
        <Link className='back-to-home' to='/'>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1> Tạo bài đăng</h1>
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
                <select required={!select} disabled={select} onChange={(e) => changeCate(e)} id='create-cate-select' ref={cateEl} name="categories" id="categories">
                  <option defaultValue="" selected disabled hidden>{defaultValue.select}</option>
                  {
                    categories && categories.length > 0 &&
                    categories.map(item =>
                      <option key={item.id} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    )
                    ||
                    <option defaultValue="" disabled>Thêm mới</option>
                  }
                </select>
                  
                    {/*<label style={{ marginLeft: 20 }} htmlFor='create-cate-create'>Create New</label>
                <input required={!select} ref={newCateEl} onChange={createNewCate} id='create-cate-create' />*/}
     
              </div>
                
              <div className='create-img'>
                <label htmlFor='create_image'>Hình ảnh thu nhỏ</label>
                <input ref={fileEl} onChange={handleChange} id='create_image' />
                <p>Hình ảnh chính của bài đăng</p>
              </div>
              <div className='create-shortdesc'>
                <label htmlFor='create_shortdesc'>Mô tả ngắn</label>
                <textarea ref={shortDescEl} onChange={(e) => { changeDesc(e) }} id='create_shortdesc' />
                <p>Mô tả ngắn của bài đăng, tối đa 512 ký tự </p>
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
                    data="<p>Type and edit your the content!</p>"
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
              <button onClick={handleSubmit}>Đăng</button>
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
export default Create