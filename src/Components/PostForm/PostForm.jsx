import React, {useCallback} from 'react'
import{useForm} from 'react-hook-form'
import {RTE, Button,Input, Select} from '../index'
import appwriteService from '../../Appwrite/config'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'


function PostForm({post}){

    console.log(post)

    

    const{register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues : {
            title : post?.title || "",
            slug : post?.slug || "",
            content : post?.content || "",
            status : post?.status || "active"
        }
    }) 

    const navigate = useNavigate()
    const userData = useSelector((state)=> state.auth.userData)
    console.log(userData)       
    
  

    const submit = async (data)=>{
        
        if(post){

            console.log(post)
           
            const file=data.image[0] ?await appwriteService.uploadFile(data.image[0]) : null;
            console.log(file)

            console.log(post.featuredimage)


            if(file){
                appwriteService.deleteFile(post.featuredimage)
            }

            const dbpost = await appwriteService.updatePost(post.$id,{...data,
                featuredimage : file? file.$id : undefined})

            console.log(dbpost) 

                if (dbpost){
                    navigate('/post/${dbpost.$id}')
                }
        
        }else{
            const file = await appwriteService.uploadFile(data.image[0]);
            console.log(data)
            console.log(file)
          

            if(file){
                const FileId=file.$id;
                data.featuredimage=FileId;
                
                const moduserId =userData.$id;
                console.log(moduserId)
                    
                const newData= {
                    ...data,
                    userid :moduserId,
                    featuredimage : FileId
                };

                delete newData.image;
                console.log(newData)

                const dbPost=await appwriteService.createPost(newData)
                console.log(dbPost)

                if(dbPost){
                    navigate('/post/${dbpost.$id}')
                }
            }   
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return(
    
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-2/3 px-2">
            <Input
                label="Title :"
                placeholder="Title"
                className="mb-4"
                {...register("title", { required: true })}
            />
            <Input
                label="Slug :"
                placeholder="Slug"
                className="mb-4"
                {...register("slug", { required: true })}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                }}
            />
            <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        </div>
        <div className="w-1/3 px-2">
            <Input
                label="Featured Image :"
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
            />
            {post && (
                <div className="w-full mb-4">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-lg"
                    />
                </div>
            )}
            <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                {...register("status", { required: true })}
            />
            <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                {post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
    )
}

export default PostForm