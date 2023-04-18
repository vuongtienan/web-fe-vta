import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { nameValidate, usernameValidate, emailValidate } from '../utils/validate'
import api from '../utils/axios'
import { connect } from 'react-redux'
import { getUserInfo } from '../redux/actions/webActions'

const SignInSelector = (props) => {
    
    const [emailErr, logEmailErr] = useState(false)
    const [usernameErr, logUsernameErr] = useState(false)
    const [firstNameErr, logFirstNameErr] = useState(false)
    const [lastNameErr, logLastNameErr] = useState(false)

    const [prePass, setPrePass] = useState('')
    const [passCheck, setPassCheck] = useState(false)

    const [userData, setUserData] = useState({})

    const history = useHistory()

    useEffect(() => {
        localStorage.clear()
    }, [])

    const emailValidation = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            email: value
        })

        if (value !== '') {
            logEmailErr(!emailValidate(value))
        } else {
            logEmailErr(false)
        }
    }

    const usernameValidation = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            username: value
        })

        if (value !== '') {
            logUsernameErr(!usernameValidate(value))
        } else {
            logUsernameErr(false)
        }
    }

    const firstNameValidation = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            firstName: value
        })

        if (value !== '') {
            logFirstNameErr(!nameValidate(value))
        } else {
            logFirstNameErr(false)
        }
    }

    const lastNameValidation = (e) => {
        let value = e.target.value || ''

        setUserData({
            ...userData,
            lastName: value
        })

        if (value !== '') {
            logLastNameErr(!nameValidate(value))
        } else {
            logLastNameErr(false)
        }
    }

    const getPrePass = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setPrePass(value)
    }

    const confirmPass = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            password: value
        })

        if (value === '') {
            setPassCheck(false)
        }
        else if (value === prePass && value.length >= 6) {
            setPassCheck(false)
        } else {
            setPassCheck(true)
        }
    }

    const checkValidate = () => {
        if (!emailErr && !usernameErr && !firstNameErr && !lastNameErr && !passCheck) {
            return true
        } else return false
    }

    const submitHandle = (e) => {
        if (checkValidate()) {
            const user = { ...userData }
            console.log("sign-up")
            api('POST', '/api/sign-up', user)
                .then(res => {
                    const { data } = res
                    const { userToken } = data

                    if (data.logged) {
                        const userInfo = data.userData

                        localStorage.setItem('logged', true)
                        localStorage.setItem('firstName', userInfo.firstName)
                        localStorage.setItem('lastName', userInfo.lastName)
                        localStorage.setItem('userId', userInfo.id)
                        localStorage.setItem('userImage', userInfo.image)
                        localStorage.setItem('userBio', userInfo.bio)
                        localStorage.setItem('userToken', userToken)
                        
                        props.getUserInfo()

                        history.replace({ pathname: '/' })
                    } else {
                        alert('Tên tài khoản đã tồn tại, vui lòng chọn tên khác!.')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .then(() => {
                    console.log('done')
                })
        } else {
            alert('Thông tin không hợp lệ!')
        }

        e.preventDefault()
    }

    return (
        <>
            <div className='sign-in-container'>
                <div className='sign-in-header'>
                    <div className='sign-in-logo-wrapper'>
                        <Link to='/'>
                            <img src='/images/pageLogo.png' alt='logo' />
                        </Link>
                    </div>
                    <h1 className='sign-in-title'>Đăng ký!</h1>
                </div>
                <form onSubmit={(e) => submitHandle(e)} id='sign-in-form'>
                    <span style={{ fontFamily: 'myFirstFontLight' }}>Họ và tên:</span>
                    <div className='form-name'>
                        <input onChange={(e) => firstNameValidation(e)} className={firstNameErr ? 'validate-error' : ''} required name='firstName' placeholder='Họ' />
                        <input onChange={(e) => lastNameValidation(e)} className={lastNameErr ? 'validate-error' : ''} required name='lastName' placeholder='Tên' />
                    </div>
                    <label htmlFor='email'>Email: </label>
                    <input onChange={(e) => emailValidation(e)} className={emailErr ? 'validate-error' : ''} required id='email' placeholder='example@email.com' name='email' />

                    <label htmlFor='username'>Tên người dùng: </label>
                    <input onChange={(e) => usernameValidation(e)} className={usernameErr ? 'validate-error' : ''} required id='username' placeholder='username123' name='username' />
                    <label htmlFor='password'>Mật khẩu: </label>
                    <input onChange={(e) => getPrePass(e)} required type='password' placeholder='a-z, 0-9, tối thiểu 6 ký tự' id='password' name='password' />
                    <label htmlFor='re-password'>Xác nhận mật khẩu: </label>
                    <input onChange={(e) => confirmPass(e)} required className={passCheck ? 'validate-error' : ''} type='password' id='re-password' placeholder='******' name='rePassword' />
                    <div className='form-btn'>
                        <Link to='/sign-in' className='sign-btn'>
                            Đăng nhập
                        </Link>
                        <button className='sign-btn active'>
                            Đăng ký
                        </button>
                    </div>

                </form>

            </div>
        </>
    )
}

const mapActionsToProps = {
    getUserInfo
}

const mapStateToProps = state => {
    return {
        web: state.web
    }
}

const SignIn = connect(mapStateToProps, mapActionsToProps)(SignInSelector)


export default SignIn