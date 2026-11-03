import React from 'react'
import styled from "styled-components"
import CancelIcon from '@mui/icons-material/Cancel';

function Tags({formData, handelChange,setFormData}) {

     /// add tags
     const addTag = (e) => {
        if (e.key === "Enter") {
          if (e.target.value.length > 0) {
            setFormData({
              ...formData,
              tags: [...formData.tags, e.target.value],
            });
            e.target.value = "";
          }
        }
      };
     
      
      /// remove tags
      const removeTag = (tag) => {
        const tags = formData.tags.slice();
        setFormData({
          ...formData,
          tags: tags.filter((x) => x !== tag),
        });
      };

  return (
        <Container>
            <label htmlFor="tag" style ={{fontFamily:"sans-serif", marginBottom:"10px"}}>Tags</label>
            <div className="tag-container">
                {formData.tags?.map((tag, index) => {
                    return (
                        <div key={index} className="tag_wrapper">
                            <span className="tag_name">{tag} </span>
                            <CancelIcon
                                className="remove-icon"
                                onClick={() => removeTag(tag)}
                              />
                             
                        </div>
                    );
                })}
                <input
                    className="tag-input"
                    type="text"
                    onKeyDown={addTag}
                    onChange={handelChange}
                />
            </div>
        </Container>
    )
}

export default Tags


const Container = styled.div`
margin-bottom: 10px;
background: rgb(245, 245, 245);
border-radius: 6px;
padding: 10px;

.tag-container {
  display: flex;
  align-items: center;
  padding: 5px;
  flex-wrap: wrap;
  min-height: 48px;
  border: 1px solid rgb(214, 216, 218);
  border-radius: 6px;
  background: white;
}

.tag_wrapper {
  display: flex;
  align-items: center;
  position:relative;
}
.tag_name {
  padding: 0px 5px;
  background: orange;
  color: white;
  border-radius: 4px;
  margin-right: 6px;
  margin-bottom: 2px;
}

     .remove-icon {
        cursor: pointer;
        position:absolute;
        box-shadow: 2px 4px 4px  rgb(0, 0, 0, 0.45);
        background:#fff;
        border-radius:50%;
        color:red;
        font-size:15px;
        top:-8px;
        right:2px;
        z-index:1;
      }


input {
  border: 0;
  outline: none;
  padding: 0;
  flex: 1;
  margin-bottom: 0px;
  height: auto;
  width:100%;
}
`;