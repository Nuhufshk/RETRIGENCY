const MediTrackAPI = (() => {
  const BASE_URL = MeditrackConfig.API_BASE_URL;

  // Create axios instance with default config
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Generic request wrapper for consistent error handling.
   */
  async function request(config) {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.message ||
          `An Error Occurred: ${error.response.status} ${error.response.statusText}`;
        console.error(`API Error (${config.url}):`, message);
        throw new Error(message);
      } else if (error.request) {
        console.error(
          `API Error (${config.url}): No response received`,
          error.request
        );
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        console.error(`API Error (${config.url}):`, error.message);
        throw error;
      }
    }
  }

  return {
    auth: {
      login: async (staffId, password) => {
        return request({
          url: "/auth/login",
          method: "POST",
          data: { staffId, password },
        });
      },

      logout: async () => {
        return request({
          url: "/auth/logout",
          method: "POST",
        });
      },

      forgotPassword: async (data) => {
        return request({
          url: "/auth/forgot-password",
          method: "POST",
          data: data,
        });
      },

      me: async () => {
        return request({
          url: "/auth/me",
          method: "GET",
        });
      },
    },

    patients: {
      getAll: async () => {
        return request({
          url: "/patients",
          method: "GET",
        });
      },

      getById: async (id) => {
        return request({
          url: `/patients/${id}`,
          method: "GET",
        });
      },

      create: async (patientData) => {
        return request({
          url: "/patients",
          method: "POST",
          data: patientData,
        });
      },

      update: async (id, patientData) => {
        return request({
          url: `/patients/${id}`,
          method: "PATCH",
          data: patientData,
        });
      },

      delete: async (id) => {
        return request({
          url: `/patients/${id}`,
          method: "DELETE",
        });
      },
    },

    profiles: {
      getByUserId: async (userId) => {
        return request({
          url: `/profiles/${userId}`,
          method: "GET",
        });
      },

      updateSettings: async (userId, settings) => {
        return request({
          url: `/profiles/${userId}/settings`,
          method: "PATCH",
          data: settings,
        });
      },

      upsert: async (userId, profileData) => {
        return request({
          url: `/profiles/${userId}`,
          method: "POST",
          data: profileData,
        });
      },
    },

    dashboard: {
      getData: async () => {
        return request({
          url: "/dashboard",
          method: "GET",
        });
      },
    },

    notifications: {
      getAll: async () => {
        return request({
          url: "/notifications",
          method: "GET",
        });
      },

      getById: async (id) => {
        return request({
          url: `/notifications/${id}`,
          method: "GET",
        });
      },

      create: async (data) => {
        return request({
          url: "/notifications",
          method: "POST",
          data,
        });
      },

      update: async (id, data) => {
        return request({
          url: `/notifications/${id}`,
          method: "PATCH",
          data,
        });
      },

      delete: async (id) => {
        return request({
          url: `/notifications/${id}`,
          method: "DELETE",
        });
      },
    },
  };
})();
