import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import organizationService from '../services/organizationService';
import { useAuth } from '../context/AuthContext';

const Organization = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const response = await organizationService.getAllMembers(user.id);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToCreator = async (userId) => {
    if (!window.confirm('Promote this user to team creator?')) return;
    try {
      await organizationService.makeCreator(user.id, userId);
      await fetchMembers();
    } catch (error) {
      alert('Failed to promote user');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organization</h1>
          <p className="mt-2 text-gray-600">{user?.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {members.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-600">
                No members found
              </li>
            ) : (
              members.map((member) => (
                <li key={member._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === 'team_creator'
                            ? 'bg-blue-100 text-blue-800'
                            : member.role === 'superadmin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.role === 'team_creator'
                          ? 'Team Creator'
                          : member.role === 'superadmin'
                          ? 'Super Admin'
                          : 'User'}
                      </span>
                      {member.role === 'user' && (
                        <button
                          onClick={() => handlePromoteToCreator(member._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Promote to Creator
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Organization;
