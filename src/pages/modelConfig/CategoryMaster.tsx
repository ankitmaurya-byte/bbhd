import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faGears } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import ModelConfiguration from "../ModelConfiguration";
// import { maincontainer } from "../Home";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { setModelProgress } from "../../store/modelConfiguration/modelSlice";
import {
  setCategories,
  setCategoryStatus,
} from "../../store/modelConfiguration/categorySlice";
import { useAlert } from "react-alert";
import Spinner from "../../components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";

interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}

const ConfigurationCard = ({
  setAllCategory,
  allCategory,
  index,
}: {
  setAllCategory: React.Dispatch<
    React.SetStateAction<{ category_name: string; [key: string]: string }[]>
  >;
  allCategory: { category_name: string; [key: string]: string }[];
  index: number;
}) => {
  const alert = useAlert();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^[a-zA-Z0-9 &,-]*$/.test(e.target.value)) {
      // Valid input: contains only letters and numbers
      const tempCategory = [...allCategory];
      if (e.target.value.length > 30) {
        alert.error("Category name cannot exceed 30 characters");
      } else {
        tempCategory[index] = { category_name: e.target.value.toUpperCase() };

        setAllCategory(tempCategory);
        alert.removeAll();
      }
    } else {
      // Invalid input: contains other characters
      setAllCategory((allCategory) => allCategory);
      alert.removeAll();
      alert.error("please enter valid category name");
    }
  };

  return (
    <div className="flex h-full items-center justify-center  bg-gray-900 rounded-lg shadow-lg">
      <div className="h-[70%] flex items-center">
        <span className="mr-2 m-2 text-white font-bold">{index + 1}.</span>
        <input
          type="text"
          id="category"
          value={
            allCategory.length > index && allCategory[index]
              ? allCategory[index].category_name
              : ""
          }
          onChange={handleCategoryChange}
          className=" p-1 w-[80%] h-full text-gray-900 block border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Category name"
        />
      </div>
    </div>
  );
};

const ReviewCard = ({
  index,
  categoryName,
}: {
  index: number;
  categoryName: string;
}) => {
  return (
    <div className="flex h-full items-center justify-center  bg-gray-900 rounded-lg shadow-lg">
      <div className="h-[70%] w-full justify-center text-center flex items-center">
        <span className="mr-2 m-2 text-white font-bold">{index + 1}.</span>
        <div className="p-1 w-[80%] text-white  block rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          {categoryName}
        </div>
      </div>
    </div>
  );
};
const CategoryMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { status, categories } = useAppSelector(
    (state) => state.modelConfiguration.CategoryMaster
  );
  const [numberOfCategory, setNumberOfCategory] = useState(
    Math.max(8, categories.length)
  );
  const [edit, setEdit] = useState(false);
  const dispatch = useAppDispatch();
  const [allCategory, setAllCategory] = useState(categories);
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [navigateBack, setNavigateBack] = useState(false);

  const handleNavigateBack = () => {
    setNavigateBack((prev) => !prev);
    mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    mainContent.current.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (status === "idel") {
      // Add any necessary logic here
    }
    if (mainContent.current && status === "succeeded") {
      dispatch(setModelProgress("CategoryMaster"));
      dispatch(setCategoryStatus("idel"));

      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      mainContent.current.scroll({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setNavigateBack(true);
    }
  }, [status, dispatch, mainContent]);

  const handelNavigateNext = () => {
    setIsLoading(true);
    console.log(allCategory);
    const updatedCategories = [];
    for (const category of allCategory) {
      if (category !== undefined) {
        updatedCategories.push(category);
      }
    }
    // dispatch(addCategories(updatedCategories));
    dispatch(setCategories(updatedCategories.slice(0, numberOfCategory)));
    dispatch(setModelProgress("CategoryMaster"));
    dispatch(setCategoryStatus("idel"));

    mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    mainContent.current.scroll({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
    setNavigateBack(true);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("navigateBack" + navigateBack);
    if (navigateBack && mainContent.current) {
      setNavigateBack((prev) => !prev);
      console.log(mainContent.pages);
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setTimeout(() => {
        mainContent.setPages((prev) =>
          prev.length >= 2 ? prev.slice(-1) : prev
        );
      }, 1000);
    }
  }, [navigateBack, mainContent]);

  return (
    <div className=" h-full grid grid-cols-[3fr_1fr] items-center justify-center  w-full ">
      <Spinner isLoading={isLoading} />
      <div className="m-auto w-[95%] h-[91%] ">
        <div className="flex items-center mb-6">
          <FontAwesomeIcon
            className="h-8 w-8 text-orange-500 mr-2"
            icon={faGears}
          />
          <h2 className="text-white text-2xl font-bold">Category Master</h2>
        </div>
        <div className="bg-gray-900 bg-opacity-75 p-8 rounded-lg  max-w-3xl w-full">
          {!edit && (
            <div className="flex mb-4  space-x-2">
              <label className="text-lg font-semibold text-gray-300">
                Number of Category name :
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(40,50,86)] focus:border-transparent w-[4rem]  text-gray-900"
                placeholder="e.g., 5"
                min="1"
                value={numberOfCategory}
                onChange={(e) => setNumberOfCategory(Number(e.target.value))}
              />
            </div>
          )}
          <div
            className="h-96 grid grid-cols-3 gap-4
          gap-y-2 overflow-y-auto auto-rows-[3.5rem] scrollbar-hide"
          >
            {!edit &&
              [...Array(numberOfCategory)].map((_, index) => (
                <ConfigurationCard
                  setAllCategory={setAllCategory}
                  allCategory={allCategory}
                  key={index}
                  index={index}
                />
              ))}
            {edit &&
              [...Array(allCategory.length)].map((_, index) => {
                if (allCategory[index]) {
                  return (
                    <ReviewCard
                      key={index}
                      categoryName={allCategory[index].category_name}
                      index={index}
                    />
                  );
                }
              })}
            {!edit && (
              <div
                onClick={() => setNumberOfCategory((prev) => prev + 1)}
                className="text-white font-bold hover:bg-gray-700 flex h-full items-center justify-between p-4 cursor-pointer bg-gray-900 rounded-lg  shadow-lg"
              >
                + Add more Category
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" gap-4 flex justify-self-center  items-center flex-col">
        {edit ? (
          <Button
            onClick={() => {
              setEdit(false);
            }}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Edit
          </Button>
        ) : (
          <Button
            onClick={() => {
              setEdit(true);
            }}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Review
          </Button>
        )}

        <div>
          <Button
            onClick={handelNavigateNext}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Submit
          </Button>
        </div>

        <div>
          <div
            onClick={handleNavigateBack}
            className="cursor-pointer px-2rem text-yellow-600 text-center hover:text-yellow-700 font-bold"
          >
            Back to model configuration
          </div>
        </div>
        <div className="relative items-center flex w-full">
          <FontAwesomeIcon
            className="absolute ml-8 cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold"
            size="lg"
            icon={faCircleArrowLeft}
          />
          <div
            onClick={handleNavigateBack}
            className="m-auto cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold"
          >
            Back to main
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMaster;
