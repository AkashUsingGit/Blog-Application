import React, {useEffect, useState} from 'react'
import Container from '../Components/Container/Container'
import  PostForm  from '../Components/PostForm/PostForm';
import appwriteService from '../Appwrite/config'
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()

    console.log(slug)
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-8'>
        <Container>
            {console.log(post)}
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost