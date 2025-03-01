import { Breadcrumb } from "@chakra-ui/react";
import { Link } from "react-router-dom";

type Props = {
  category: string | null;
  name: string;
};

export const BreadcrumbsInfo = ({ category, name }: Props) => {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <Link to="/">Auctions</Link>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        {!!category && (
          <>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link to={`/auctions?Categories=${category}`}>{category}</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </>
        )}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};
