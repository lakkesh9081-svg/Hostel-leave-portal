import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ParentDashboard() {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  const [profilesByStudentId, setProfilesByStudentId] = useState({});

  const token = localStorage.getItem('token');
  const PARENT_MOBILE = '8667419081';


  const fetchRequests = async () => {
    const res = await axios.get('/api/outpass', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRequests(res.data);
  };



  useEffect(() => {
    setError('');
    if (!token) return;
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);



  const decide = async (id, action) => {
    try {
      setLoadingId(id);
      await axios.put(
        `/api/outpass/${id}/parent`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Parent Dashboard</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl mb-3">Pending Parent Approvals</h2>

        {requests.length === 0 ? (
          <p className="text-gray-400">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const telLink = `tel:${PARENT_MOBILE}`;


              return (
                <div key={r._id} className="flex justify-between items-start gap-4 bg-black/20 p-4 rounded-2xl">
                  <div>
                    <div className="font-semibold">{r.applicationCode}</div>
                    <div className="text-sm text-gray-300">Student: {r.studentId?.name || ''}</div>
                    <div className="text-sm text-gray-300">{r.fromDate} - {r.toDate}</div>
                    <div className="text-sm text-gray-300 mt-1">Reason: {r.reason}</div>

                    <div className="mt-3">
                      <div className="text-sm text-gray-300 font-semibold mb-1">1-number call approval:</div>
                      {telLink ? (
                        <a
                          className="inline-flex items-center gap-2 bg-green-500/20 text-green-200 border border-green-500/30 px-3 py-2 rounded-xl"
                          href={telLink}
                        >
                          📞 Call Parent ({PARENT_MOBILE})

                        </a>
                      ) : (
                        <div className="text-sm text-gray-400">Parent phone not available</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => decide(r._id, 'approve')}
                      disabled={loadingId === r._id}
                    >
                      {loadingId === r._id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => decide(r._id, 'reject')}
                      disabled={loadingId === r._id}
                    >
                      {loadingId === r._id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

