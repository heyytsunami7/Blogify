import React from 'react'
import { Container, PostForm } from '../components'
import useTitle from '../utils/useTitle'
function AddPost() {
  useTitle('New story')
  return (
    <div>
        <Container>
            <PostForm/>
        </Container>
    </div>
  )
}

export default AddPost