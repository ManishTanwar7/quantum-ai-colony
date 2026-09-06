const API_BASE = '/api';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('quantum_colony_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (e) {
      // not JSON
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email, password) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, role) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
  demoLogin: (role) => fetchApi(`/auth/demo-login/${role}`, { method: 'POST' }),
  getMe: () => fetchApi('/auth/me'),

  // Circuits
  runCircuit: (numQubits, gates, shots = 1024, qiskitCode = null) => 
    fetchApi('/circuits/run', { 
      method: 'POST', 
      body: JSON.stringify({ num_qubits: numQubits, gates, shots, qiskit_code: qiskitCode }) 
    }),
  saveCircuit: (title, description, circuitJson, qiskitCode, numQubits) => 
    fetchApi('/circuits/save', { 
      method: 'POST', 
      body: JSON.stringify({ title, description, circuit_json: circuitJson, qiskit_code: qiskitCode, num_qubits: numQubits }) 
    }),
  listCircuits: () => fetchApi('/circuits/list'),
  deleteCircuit: (id) => fetchApi(`/circuits/${id}`, { method: 'DELETE' }),

  // Colony AI
  getColonyStatus: () => fetchApi('/colony/status'),
  getColonyMessages: () => fetchApi('/colony/messages'),
  getMissionPresets: () => fetchApi('/colony/presets'),
  dispatchMission: (title, prompt, missionId = null) => 
    fetchApi('/colony/missions', { 
      method: 'POST', 
      body: JSON.stringify({ title, prompt, mission_id: missionId }) 
    }),

  // Learning
  getLessons: () => fetchApi('/learning/lessons'),
  getLesson: (id) => fetchApi(`/learning/lessons/${id}`),
  submitQuiz: (lessonId, answers) => 
    fetchApi('/learning/quiz-submit', { 
      method: 'POST', 
      body: JSON.stringify({ lesson_id: lessonId, answers }) 
    }),
  getChallenges: () => fetchApi('/learning/challenges'),
  getChallenge: (id) => fetchApi(`/learning/challenges/${id}`),
  submitChallenge: (challengeId, circuit, qiskitCode) => 
    fetchApi('/learning/submit-challenge', { 
      method: 'POST', 
      body: JSON.stringify({ challenge_id: challengeId, circuit, qiskit_code: qiskitCode }) 
    }),
  getMyProgress: () => fetchApi('/learning/my-progress'),

  // Instructor
  getInstructorAnalytics: () => fetchApi('/instructor/analytics'),
  getStudentsList: () => fetchApi('/instructor/students'),
  getSubmissionsList: () => fetchApi('/instructor/submissions'),
};
