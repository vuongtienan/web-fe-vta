import MainTemplate from '../../layouts/MainLayout'
import Collection1 from './collection1'
import Latest from './latest'
import Video from './video'
import { useEffect, useState } from 'react'
import api from '../../utils/axios'
import { connect } from 'react-redux'
import { toggleLoading } from '../../redux/actions/webActions'

const HomeSelector = (props) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        props.toggleLoading(true)
        api('GET', 'api/posts')
            .then(res => {
                if (res.data && res.data.status) {
                    setPosts(res.data.posts)
                    props.toggleLoading(false)
                }
            })
            .then(() => {
                props.toggleLoading(false)
            })
    }, [])

    return (
        <>
            <MainTemplate>
                <Collection1 posts={posts} />
                <Latest posts={posts} />
                <Collection1 posts={posts} />
                <Video embedId="rokGy0huYEA" />
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

const Home = connect(mapStateToProps, mapActionToProps)(HomeSelector)

export default Home