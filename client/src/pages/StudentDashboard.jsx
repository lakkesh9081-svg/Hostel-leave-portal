import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [form, setForm] = useState({
    reason: '',
    fromDate: '',
    toDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem('token');

  const fetchMyRequests = async () => {
    const res = await axios.get('/api/outpass', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRequests(res.data);
  };

  useEffect(() => {
    if (token) fetchMyRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const applyLeave = async () => {
    if (!(form.reason && form.fromDate && form.toDate)) {
      alert('Please Fill All Fields');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        '/api/outpass',
        {
          reason: form.reason,
          fromDate: form.fromDate,
          toDate: form.toDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setForm({ reason: '', fromDate: '', toDate: '' });
      await fetchMyRequests();
      alert('Leave Applied Successfully');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to apply leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8 relative overflow-hidden">
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-r from-pink-500 to-purple-600 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-cyan-400 to-teal-500 opacity-10 blur-3xl rounded-full animate-bounce"></div>

      <div className="relative z-10">
        <div className="dashboard-header flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="profile-avatar w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              S
            </div>
            <div>
              <h1 className="gradient-text text-4xl font-extrabold">Student Dashboard</h1>
              <p className="text-gray-400 mt-2 font-medium">Apply and Track Hostel Leave Requests</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="btn-submit bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-2xl font-semibold shadow-lg"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="dashboard-card bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Total Leaves</h2>
              <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-5xl font-extrabold text-pink-400">{requests.length}</p>
            <p className="text-xs text-gray-400 mt-3">Your leave applications</p>
          </div>

          <div className="dashboard-card bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Approved</h2>
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-5xl font-extrabold text-green-400">{requests.filter(r => r.status === 'Approved').length}</p>
            <p className="text-xs text-gray-400 mt-3">Completed approvals</p>
          </div>

          <div className="dashboard-card bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Pending</h2>
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-5xl font-extrabold text-yellow-400">{requests.filter(r => r.status !== 'Approved' && r.status !== 'Rejected').length}</p>
            <p className="text-xs text-gray-400 mt-3">Waiting for approvals</p>
          </div>
        </div>

        <div className="form-container bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[35px] p-8 shadow-2xl max-w-3xl hover:shadow-pink-500/20 transition">
          <h2 className="gradient-text text-3xl font-bold mb-8">Apply Leave</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-300 flex items-center font-semibold">
                <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Leave Reason
              </label>
              <input
                type="text"
                placeholder="Enter reason"
                className="form-input w-full p-4 rounded-2xl bg-black/30 border border-white/20 outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 hover:border-pink-400 text-white"
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                value={form.reason}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 flex items-center font-semibold">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                From Date
              </label>
              <input
                type="date"
                className="form-input w-full p-4 rounded-2xl bg-black/30 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:border-blue-400 text-white cursor-pointer"
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                value={form.fromDate}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-300 flex items-center font-semibold">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                To Date
              </label>
              <input
                type="date"
                className="form-input w-full p-4 rounded-2xl bg-black/30 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:border-purple-400 text-white cursor-pointer"
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                value={form.toDate}
              />
            </div>
          </div>

          <button
            onClick={applyLeave}
            disabled={loading}
            className="btn-submit mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg hover:scale-105 transition duration-300 shadow-lg hover:shadow-pink-500/50 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </div>

        <div className="relative z-10 mt-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-blue-500/20 transition">
          <h2 className="gradient-text text-2xl font-bold mb-5">Your Leave Status</h2>

          {requests.length === 0 ? (
            <p className="text-gray-400">No leave requests yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r._id} className="activity-item flex justify-between items-center bg-black/20 p-4 rounded-2xl hover:bg-black/30 transition">
                  <div>
                    <h3 className="font-semibold">{r.applicationCode}</h3>
                    <p className="text-sm text-gray-400">{r.fromDate} - {r.toDate}</p>
                    <p className="text-sm text-gray-300">{r.reason}</p>
                  </div>
                  <span className="status-badge bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

