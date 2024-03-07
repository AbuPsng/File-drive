import FileBrowser from "../_components/FileBrowser";

const FilesPage = () => {
  return (
    <div>
      <FileBrowser title={"Your Files"} deleteOnly={true} />
    </div>
  );
};

export default FilesPage;
