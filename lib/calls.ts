import axios from 'axios'
import toast from 'react-hot-toast'

export const uploadImage = async (image: File) => {
	const body = new FormData()
	body.append('image', image)
	const { data } = await axios.post('/api/images/upload', body, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	if (!data?.url) {
		toast.error('Image upload failed, please try again later')
		return
	}
	return data
}
