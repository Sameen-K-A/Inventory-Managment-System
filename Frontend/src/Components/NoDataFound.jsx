import image from "../../public/noData.jpg";

const NoDataFound = () => {
   return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center mx-auto" style={{ height: "60vh" }}>
         <img src={image} alt="No Data" className="img-fluid mb-3" style={{ maxWidth: '300px' }} />
         <p>No Resource Found</p>
      </div>
   );
};

export default NoDataFound;