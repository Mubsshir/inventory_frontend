
import LoadingGif from "/Loading.gif";

const Loading = () => {
  return (
    <div className='w-full h-lvh flex items-center justify-center bg-white  '>
        <img src={LoadingGif} alt="loading" className='w-48  h-48 '  />
    </div>
  )
}

export default Loading