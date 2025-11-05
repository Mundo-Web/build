import BasicRest from "./BasicRest";

class JobApplicationRest extends BasicRest {
  path = 'job-applications'
  is_use_notify = false;
  hasFiles = true; // Importante: habilitamos soporte para archivos
}

export default JobApplicationRest