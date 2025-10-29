import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import teamService from '../services/teamService';
import projectService from '../services/projectService';

const Dashboard = () => {
  const { user, isOrgAccount } = useAuth();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isOrgAccount) {
          const [teamsRes, projectsRes] = await Promise.all([
            teamService.getUserTeams(),
            projectService.listProjects(),
          ]);
          setTeams(teamsRes.data.teams || []);
          setProjects(projectsRes.data.projects || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOrgAccount]);

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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            {isOrgAccount
              ? 'Manage your organization and teams'
              : 'Here\'s an overview of your teams and projects'}
          </p>
        </div>

        {!isOrgAccount && (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">My Teams</h2>
                <Link
                  to="/teams"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all teams →
                </Link>
              </div>
              {teams.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                  You are not part of any teams yet.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {teams.slice(0, 6).map((team) => (
                    <Link
                      key={team._id}
                      to={`/teams/${team._id}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {team.members?.length || 0} members
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
                <Link
                  to="/projects"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all projects →
                </Link>
              </div>
              {projects.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                  No projects available.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.slice(0, 6).map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.team && (
                        <p className="text-xs text-gray-500 mt-2">
                          Team: {project.team.name}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {isOrgAccount && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Organization Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your organization settings and view member information.
            </p>
            <Link
              to="/organization"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Go to Organization Settings
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
