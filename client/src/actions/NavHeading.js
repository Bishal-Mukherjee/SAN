export const getHeading = () => {
  const heading = window.location.href.substring(
    window.location.href.indexOf("/loc/") + 5
  );

  let fHeading;

  if (heading === "dashboard") {
    fHeading = "Dashboard";
  }

  if (heading.substring(0, 9) === "dashboard") {
    fHeading = "Dashboard";
  }

  if (heading === "class-stories") {
    fHeading = "Class Stories";
  }

  if (heading === "create-notice") {
    fHeading = "Create Notice";
  }

  if (heading === "profile") {
    fHeading = "Profile";
  }

  if (heading === "add-assignment") {
    fHeading = "Add Assignment";
  }

  if (heading === "approve-posts") {
    fHeading = "Approve Posts";
  }

  if (heading.substring(0, 6) === "doubts") {
    fHeading = "Asked doubts";
  }

  return fHeading;
};
