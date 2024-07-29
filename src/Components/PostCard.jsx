import React from 'react'
import appwriteService from '../Appwrite/config'
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredimage}) {

  console.log(featuredimage)

  const imageUrl = featuredimage ? appwriteService.getFilePreview(featuredimage) : null;
    
  return (
    <Link to={`/Post/${$id}`}>
      
        <div className='w-full bg-gray-100 rounded-xl p-4'> 
            <div className='w-full justify-center mb-4'>

              {
                imageUrl ? <img
                src={imageUrl}
                alt={title}
                className='rounded-xl'
                /> :  <div className='rounded-xl bg-gray-300 h-32 w-full flex items-center justify-center'>
                <span>No Image Available</span>
            </div>
                
              }

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard