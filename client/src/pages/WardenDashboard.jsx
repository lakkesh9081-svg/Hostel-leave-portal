export default function WardenDashboard() {

  return (
    <div className='p-10'>

      <h1 className='text-3xl font-bold'>
        Warden Dashboard
      </h1>

      <div className='mt-5 bg-white shadow p-5 rounded'>

        <h2 className='text-xl mb-3'>
          Final Leave Approval
        </h2>

        <button className='bg-green-500 text-white px-4 py-2 rounded mr-3'>
          Final Approve
        </button>

        <button className='bg-red-500 text-white px-4 py-2 rounded'>
          Reject
        </button>

      </div>

    </div>
  )
}