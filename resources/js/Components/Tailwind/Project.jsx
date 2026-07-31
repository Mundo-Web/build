import React from "react";

const ProjectsGalleryNgs = React.lazy(() => import("./Projects/ProjectsGalleryNgs"));

const Project = ({ data, items, which, generals }) => {
    switch (which) {
        case "ProjectsGalleryNgs":
        default:
            return (
                <ProjectsGalleryNgs
                    data={data}
                    items={items}
                    generals={generals}
                />
            );
    }
};

export default Project;
