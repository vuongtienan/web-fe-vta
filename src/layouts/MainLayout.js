import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserInfo } from '../redux/actions/webActions'
import { useEffect, useState } from 'react'
import api from '../utils/axios'

const MainTemplateSelector = (props) => {
    const location = useLocation()
    const asPath = location.pathname || '/'

    const [siteInfo, setSiteInfo] = useState({})

    useEffect(() => {
        props.getUserInfo()
        api('GET', 'api/site')
            .then(res => {
                if (res.data && res.data.status) {
                    setSiteInfo(res.data.site)
                }
            })
    }, [])

    return (
        <>
            <Header asPath={asPath} />
            <div>
                {props.children}
                
            </div>
            <Footer site={siteInfo} />
            
        </>
    )
}

const MainTemplate = connect(null, { getUserInfo })(MainTemplateSelector)
export default MainTemplate