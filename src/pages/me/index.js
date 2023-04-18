import { useEffect, useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import api from '../../utils/axios'
import { connect } from 'react-redux'
import getImage from '../../utils/getImage'

const MeSelector = (props) => {

  const history = useHistory()
  const { web } = props

  const firstNameEl = useRef(null)
  const lastNameEl = useRef(null)
  const bioEl = useRef(null)
  const oldPassEl = useRef(null)
  const newPassEl = useRef(null)
  const confirmPassEl = useRef(null)
  const fileEl = useRef(null)

  const [tempBio, setTempBio] = useState('Create your bio')
  const [changeForm, setChangeForm] = useState(false)
  const [data, getData] = useState({ name: '', path: '' })
  const [file, setFile] = useState(web.user.userImage)
  const [oldPassErr, setOldPassErr] = useState(false)
  const [newPassErr, setNewPassErr] = useState(false)
  const [confirmPassErr, setConfirmPassErr] = useState(false)
  const [changingPass, setChangingPass] = useState(false)
  const [userPosts, setUserPosts] = useState(0)
  const [changingAvt, setChangingAvt] = useState(false)
  const handleOldPass = (e) => {
    let value = e.target.value
    value = value.trim()
    if (value.length < 6) {
      setOldPassErr(true)
    } else {
      setOldPassErr(false)
    }

    if (value === '') {
      setOldPassErr(false)
    }
  }

  const handleNewPass = (e) => {
    let value = e.target.value
    value = value.trim()
    if (value.length < 6) {
      setNewPassErr(true)
    } else {
      setNewPassErr(false)
    }

    if (value === '') {
      setNewPassErr(false)
    }

  }

  const closeChangePass = () => {
    oldPassEl.current.value = null
    newPassEl.current.value = null

    setChangingPass(false)
  }

  const handleConfirmPass = (e) => {
    let value = e.target.value
    value = value.trim()

    if (value !== newPassEl.current.value) {
      setConfirmPassErr(true)
    } else {
      setConfirmPassErr(false)
    }

    if (value === '') {
      setConfirmPassErr(false)
    }

  }

  const handleSubmit = () => {
    const firstName = firstNameEl.current.value && firstNameEl.current.value.length > 0 && firstNameEl.current.value || web.user.firstName
    const lastName = lastNameEl.current.value && lastNameEl.current.value.length > 0 && lastNameEl.current.value || web.user.lastName
    const bio = bioEl.current.value && bioEl.current.value.length > 0 && bioEl.current.value || web.user.userBio
    const oldPass = oldPassEl.current.value && oldPassEl.current.value.length > 5 && oldPassEl.current.value || null
    const newPass = newPassEl.current.value && newPassEl.current.value.length > 5 && newPassEl.current.value || null

    const data = {
      file,
      firstName,
      lastName,
      bio,
      newPass,
      oldPass
    }

    if (!oldPassErr && !newPassErr && !confirmPassErr) {
      api('POST', 'api/me', data)
        .then(res => {
          if (res.data && res.data.status) {
            const { newInfo } = res.data
            localStorage.setItem('firstName', newInfo.firstName)
            localStorage.setItem('lastName', newInfo.lastName)
            localStorage.setItem('userBio', newInfo.bio)
            const { newToken } = res.data

            if (newToken && newToken.length > 0) {
              localStorage.setItem('userToken', newToken)
            }

            setChangeForm(false)
            window.location.reload()
          } else {
            console.log('.')
          }
        })
    }
  }

  const changeAvt = () => {
    const formData = new FormData()
    formData.append('image', file)

    api('POST', 'api/me/avt', formData)
      .then(res => {
        if (res.data && res.data.status) {
          localStorage.setItem('userImage', res.data.newImage)
          window.location.reload()
        }
      })

  }

  const handleAvtChange = (e) => {
    const selectedFile = e.target.value
    setFile(selectedFile)
  }

  useEffect(() => {
    props.dispatch({ type: 'GET_USERINFOR' })

    api('GET', '/api/me')
      .then(res => {

        if (res.data && res.data.status) {
          setUserPosts(res.data.posts)
        } else {
          history.replace({ pathname: '/sign-in' })
        }
      })
      .catch(err => {
        console.log('loi')
        console.log(err)
      })
  }, [])

  return (
    <div className='profile'>
      <div className='edit-form' hidden={!changeForm}>
        <button onClick={() => setChangeForm(false)} className='back-btn'>
          <i className="fas fa-times"></i>
        </button>
        <div className='edit-form-container'>
          <h3>Chỉnh sửa hồ sơ của bạn</h3>
          <div className='edit-form-input'>
            <input ref={firstNameEl} placeholder={web.user.firstName} />
            <input ref={lastNameEl} placeholder={web.user.lastName} />
            <input ref={bioEl} placeholder={web.user.userBio} />
          </div>
          <div className='password-form'>
            <p onClick={() => setChangingPass(true)}>Thay đổi mật khẩu</p>
            <div className='change-pass-container' hidden={!changingPass}>
              <i onClick={closeChangePass} className="fas fa-times-circle"></i>
              <input onChange={handleOldPass} ref={oldPassEl} type='password' style={{ borderColor: oldPassErr && 'rgb(231, 100, 100)' }} placeholder='current password'></input>
              <input onChange={handleNewPass} ref={newPassEl} type='password' style={{ borderColor: newPassErr && 'rgb(231, 100, 100)' }} placeholder='new password'></input>
              <input onChange={handleConfirmPass} ref={confirmPassEl} type='password' style={{ borderColor: confirmPassErr && 'rgb(231, 100, 100)' }} placeholder='confirm password'></input>
            </div>
          </div>
          <button disabled={!(!oldPassErr && !newPassErr && !confirmPassErr)} style={{ cursor: !(!oldPassErr && !newPassErr && !confirmPassErr) && 'no-drop' || 'pointer' }} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className='profile-container'>
        <div className='profile-header-container'>
          <div className='profile-header'>
            <Link to='/'>
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1>Hồ sơ</h1>
          </div>
        </div>
        <div className='profile-body'>
          <div className='body-user-info'>
            <div className='avt-wrapper'>
              <img src={getImage(file || web.user.userImage)} />
              <button onClick={() => setChangingAvt(true)} htmlFor='change-avt' className='change-avt'>
                <i className="fas fa-camera"></i>
              </button>
            </div>
            {
              changingAvt &&
              <div className='profile-changeavt-form'>
                <input onChange={handleAvtChange} id='avt-change' ref={fileEl} placeholder='avatar image link:' />
                <button onClick={changeAvt} className='change-avt-btn'>Lưu</button>
              </div>
            }
            <div className='user-bio'>
              <p>{`${web.user && web.user.firstName} ${web.user && web.user.lastName}`}</p>
              <span>{web.user.userBio}</span>
            </div>
            <div className='user-data'>
              <div className='follow-data'>
                <span>1</span>
                <Link to='/'>Theo dõi</Link>
              </div>
              <div className='following-data'>
                <span>2</span>
                <Link to='/'>Đang theo dõi</Link>
              </div>
              <div className='post-data'>
                <span>{userPosts || 0}</span>
                <a href={`/posts/me`}>Bài đăng</a>
              </div>
            </div>
            <div className='option'>
              <button className='setting' onClick={() => setChangeForm(true)}>
                <i className="fas fa-user-edit"></i>
              </button>
              <Link to='/sign-in' className='close-btn'>
                <i className="fas fa-power-off"></i>
              </Link>
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

const Me = connect(mapStateToProps)(MeSelector)

export default Me