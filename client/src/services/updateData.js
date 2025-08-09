const updateData = ({ data, setData, method = "POST", itemId,  fullObject }) => {
  switch (method) {
    case "POST":
      // Add new item to array
      if (fullObject) {
        const newItem = { ...fullObject, _id: itemId };
        setData([...data, newItem]);
      }
      break;
      
    case "PUT":
      // Update existing item by replacing it
      if (fullObject && itemId) {
        const updatedItem = { ...fullObject, _id: itemId };
        setData(data.map(item => 
          item._id === itemId ? updatedItem : item
        ));
      }
      break;
      
    case "PATCH":
      // Partially update existing item
      if (fullObject && itemId) {
        setData(data.map(item => 
          item._id === itemId ? { ...item, ...fullObject } : item
        ));
      }
      break;
      
    case "DELETE":
      // Remove item from array
      if (itemId) {
        setData(data.filter(item => item._id !== itemId));
      }
      break;
      
    default:
      console.warn(`Unsupported method: ${method}`);
      break;
  }
};

export default updateData;